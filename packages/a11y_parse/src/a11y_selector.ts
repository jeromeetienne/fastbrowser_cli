// node imports
import Assert from "node:assert";

// local imports
import type { AxNode } from "./a11y_tree";
import { A11yTree } from "./a11y_tree";

// role                        → match by role
// role[attr=value]            → attribute equals
// role[attr^=value]           → starts with
// role[attr$=value]           → ends with
// role[attr*=value]           → contains
// role[attr]                  → attribute exists
// role[name="..."]            → name is treated as a virtual attribute
// #uid                        → match by uid
// *                           → any role
// A B                         → B is a descendant of A
// A > B                       → B is a direct child of A
// A, B                        → union

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

type Token =
	| { kind: "ident"; value: string }
	| { kind: "string"; value: string }
	| { kind: "symbol"; value: "#" | "*" | "[" | "]" | ">" | "," | "=" }
	| { kind: "op"; value: "^=" | "$=" | "*=" | "=" }
	| { kind: "ws" };

type AttrMatch = {
	name: string;
	op?: "=" | "^=" | "$=" | "*=";
	value?: string;
};

interface SimpleSelector {
	role?: string;
	uid?: string;
	attrs: AttrMatch[];
}

type Combinator = " " | ">";

interface CompoundSelector {
	parts: Array<{ combinator: Combinator | null; simple: SimpleSelector }>;
}

export class A11yQuery {
	static querySelector(root: AxNode, selector: string): AxNode | undefined {
		const groups = A11yQuery.parseSelector(selector);
		for (const n of A11yTree.walk(root)) {
			if (groups.some((g) => A11yQuery.matchCompound(n, g))) return n;
		}
		return undefined;
	}

	static querySelectorAll(root: AxNode, selector: string): AxNode[] {
		const groups = A11yQuery.parseSelector(selector);
		const out: AxNode[] = [];
		for (const n of A11yTree.walk(root)) {
			if (groups.some((g) => A11yQuery.matchCompound(n, g))) out.push(n);
		}
		return out;
	}

	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	//	
	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////

	private static tokenize(input: string): Token[] {
		const tokens: Token[] = [];
		let i = 0;

		while (i < input.length) {
			const c = input[i];

			if (/\s/.test(c)) {
				while (i < input.length && /\s/.test(input[i])) i++;
				tokens.push({ kind: "ws" });
				continue;
			}

			if (c === '"') {
				let j = i + 1;
				let value = "";
				while (j < input.length && input[j] !== '"') {
					if (input[j] === "\\" && j + 1 < input.length) {
						value += input[j + 1];
						j += 2;
					} else {
						value += input[j++];
					}
				}
				if (input[j] !== '"') throw new Error("Unterminated string");
				tokens.push({ kind: "string", value });
				i = j + 1;
				continue;
			}

			if (c === "^" || c === "$" || c === "*") {
				if (input[i + 1] === "=") {
					tokens.push({ kind: "op", value: `${c}=` as "^=" | "$=" | "*=" });
					i += 2;
					continue;
				}
			}

			if ("#[]>,".includes(c)) {
				tokens.push({ kind: "symbol", value: c as "#" | "[" | "]" | ">" | "," });
				i++;
				continue;
			}

			if (c === "*") {
				tokens.push({ kind: "symbol", value: "*" });
				i++;
				continue;
			}

			if (c === "=") {
				tokens.push({ kind: "op", value: "=" });
				i++;
				continue;
			}

			if (/[\w-]/.test(c)) {
				let j = i;
				while (j < input.length && /[\w-]/.test(input[j])) j++;
				tokens.push({ kind: "ident", value: input.slice(i, j) });
				i = j;
				continue;
			}

			throw new Error(`Unexpected character '${c}' at ${i}`);
		}

		return tokens.filter(
			(t, idx, arr) =>
				!(t.kind === "ws" && (idx === 0 || idx === arr.length - 1 || arr[idx - 1].kind === "ws"))
		);
	}

	private static parseSelector(input: string): CompoundSelector[] {
		const tokens = A11yQuery.tokenize(input);
		const groups: CompoundSelector[] = [];
		let i = 0;

		const peek = () => tokens[i];
		const eat = () => tokens[i++];

		const parseSimple = (): SimpleSelector => {
			const sel: SimpleSelector = { attrs: [] };
			const t = peek();

			if (t?.kind === "symbol" && t.value === "#") {
				eat();
				const id = eat();
				if (id?.kind !== "ident") throw new Error("Expected uid after #");
				sel.uid = id.value;
			} else if (t?.kind === "symbol" && t.value === "*") {
				eat();
			} else if (t?.kind === "ident") {
				sel.role = eat().kind === "ident" ? (t as { kind: "ident"; value: string }).value : undefined;
			} else {
				throw new Error(`Expected role, *, or #uid; got ${JSON.stringify(t)}`);
			}

			while (peek()?.kind === "symbol" && (peek() as { kind: "symbol"; value: string }).value === "[") {
				eat();
				const nameTok = eat();
				if (nameTok?.kind !== "ident") throw new Error("Expected attribute name");
				const attr: AttrMatch = { name: nameTok.value };

				const next = peek();
				if (next?.kind === "op") {
					attr.op = eat().kind === "op" ? (next as { kind: "op"; value: "^=" | "$=" | "*=" | "=" }).value : undefined;
					const val = eat();
					if (val?.kind !== "string" && val?.kind !== "ident")
						throw new Error("Expected attribute value");
					attr.value = val.value;
				}

				const close = eat();
				if (close?.kind !== "symbol" || close.value !== "]")
					throw new Error("Expected ]");
				sel.attrs.push(attr);
			}

			return sel;
		};

		const parseCompound = (): CompoundSelector => {
			const parts: CompoundSelector["parts"] = [];
			parts.push({ combinator: null, simple: parseSimple() });

			while (i < tokens.length) {
				const t = peek();
				if (t?.kind === "symbol" && t.value === ",") break;

				let combinator: Combinator | null = null;
				if (t?.kind === "ws") {
					eat();
					combinator = " ";
				}
				if (peek()?.kind === "symbol" && (peek() as { kind: "symbol"; value: string }).value === ">") {
					eat();
					combinator = ">";
					if (peek()?.kind === "ws") eat();
				}

				if (combinator === null) break;
				if (peek() === undefined || (peek()?.kind === "symbol" && (peek() as { kind: "symbol"; value: string }).value === ","))
					break;

				parts.push({ combinator, simple: parseSimple() });
			}

			return { parts };
		};

		groups.push(parseCompound());
		while (peek()?.kind === "symbol" && (peek() as { kind: "symbol"; value: string }).value === ",") {
			eat();
			if (peek()?.kind === "ws") eat();
			groups.push(parseCompound());
		}

		return groups;
	}

	private static getAttr(node: AxNode, name: string): string | undefined {
		if (name === "name") return node.name;
		return node.attributes[name];
	}

	private static matchSimple(node: AxNode, sel: SimpleSelector): boolean {
		if (sel.uid !== undefined && node.uid !== sel.uid) return false;
		if (sel.role !== undefined && node.role !== sel.role) return false;

		for (const a of sel.attrs) {
			const actual = A11yQuery.getAttr(node, a.name);
			if (actual === undefined) return false;
			if (a.op === undefined) continue;
			const v = a.value ?? "";
			switch (a.op) {
				case "=":
					if (actual !== v) return false;
					break;
				case "^=":
					if (!actual.startsWith(v)) return false;
					break;
				case "$=":
					if (!actual.endsWith(v)) return false;
					break;
				case "*=":
					if (!actual.includes(v)) return false;
					break;
			}
		}

		return true;
	}

	private static matchCompound(node: AxNode, compound: CompoundSelector): boolean {
		const parts = compound.parts;
		const last = parts[parts.length - 1];
		if (!A11yQuery.matchSimple(node, last.simple)) return false;

		let current: AxNode | undefined = node.parent;
		for (let p = parts.length - 2; p >= 0; p--) {
			const { combinator } = parts[p + 1];
			const target = parts[p].simple;

			if (combinator === ">") {
				if (!current || !A11yQuery.matchSimple(current, target)) return false;
				current = current.parent;
			} else {
				while (current && !A11yQuery.matchSimple(current, target)) current = current.parent;
				if (!current) return false;
				current = current.parent;
			}
		}

		return true;
	}

}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	usage examples
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

async function usageExample() {
	const treeText = [
		// '## Latest page snapshot',
		'uid=1_0 RootWebArea "Example Domain" url="https://www.example.com/"',
		'  uid=1_1 heading "Example Domain" level="1"',
		'  uid=1_2 StaticText "This domain is for use in documentation examples without needing permission. Avoid use in operations."',
		'  uid=1_3 link "Learn more" url="https://iana.org/domains/example"',
		'    uid=1_4 StaticText "Learn more"',
		'',
	].join('\n');
	console.log("Expected snapshot text content:");
	console.log(treeText);

	console.log('-----')

	const axTree = A11yTree.parse(treeText);

	// By role
	// const axnodes = A11yQuery.querySelectorAll(axTree, "link");
	// debugger

	// // By uid
	// querySelector(tree, "#1_3");

	// // Attribute equals
	// querySelector(tree, 'link[name="Learn more"]');

	// // Attribute starts-with
	// querySelectorAll(tree, 'link[url^="https://iana.org"]');

	// // Attribute exists
	// querySelectorAll(tree, "heading[level]");

	// // Descendant
	// querySelectorAll(tree, "RootWebArea link");

	// // Direct child
	// querySelectorAll(tree, "RootWebArea > heading");

	// // Union
	// querySelectorAll(tree, "heading, link");

	// // Mixed
	// querySelector(tree, 'RootWebArea > link[url*="iana"]');

	// Select
	const linkNode = A11yTree.findOne(axTree, A11yTree.filterByRole("link"));
	Assert.ok(linkNode, "Link node not found");
	console.log(linkNode?.name, linkNode?.attributes.url);
	console.log(linkNode)

	// Write (mutate)
	const headingNode = A11yTree.findOne(axTree, A11yTree.filterByUid("1_1"));
	if (headingNode !== undefined) {
		headingNode.name = "New Heading";
	}

	// Serialize back
	debugger
	const treeTextNew = A11yTree.stringify(axTree);
	console.log("Serialized tree:");
	console.log(treeTextNew);
}

if (require.main === module) {
	void usageExample();
}
