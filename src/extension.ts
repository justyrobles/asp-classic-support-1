import { ExtensionContext, workspace, window, Position, languages, IndentAction, Selection, SnippetString } from "vscode";
import hoverProvider from "./hover";
import completionProvider from "./completion";
import symbolsProvider from "./symbols";
import signatureProvider from "./signature";
import definitionProvider from "./definition";
import colorProvider from "./colorprovider";
import { IncludeFile, includes } from "./includes";
import { AspSymbol } from "./types";
import { addRegionHighlights } from "./highlight";

export const output = window.createOutputChannel("ASP Classic");

/** List of all built-in ASP symbols parsed once from source files. */
export const builtInSymbols = new Set<AspSymbol>();

export function activate(context: ExtensionContext): void {

	try {
		// When there are three ''' in a row we will auto-insert more on enter
		languages.setLanguageConfiguration("html", {
			onEnterRules: [
				{
					// Only insert new ''' if we haven't already typed </summary>
					beforeText: /^\s*'''((?!<\/summary>).)*$/i,
					action: { indentAction: IndentAction.None, appendText: '\'\'\' ' }
				}
			],
		});

		workspace.onDidChangeTextDocument(event => {
			if (window.activeTextEditor && event.document === window.activeTextEditor.document) {
				const changes = event.contentChanges;

				// INSERT ''' <summary> line when ''' is typed
				if(changes.length > 0 && changes[0].text === '\'') {
					const change = changes[0];

					// We don't have enough characters on this line to have a doc comment
					if(change.range.end.character <= 1) {
						return;
					}

					const document = window.activeTextEditor.document;
					const line = document.lineAt(change.range.end.line);

					// If our line doesn't end with ''', do nothing
					if(!line.text.endsWith("'''")) {
						return;
					}

					const editor = window.activeTextEditor;

					let insertPosition = change.range.end;

					insertPosition = new Position(insertPosition.line, insertPosition.character + 1);

					// TODO: build a snippet with function parameters as well
					const snippet = new SnippetString(" <summary>$0</summary>");

					editor.insertSnippet(snippet, insertPosition);
				}
			}
		});

		output.appendLine("Extension activated");

		var functionIncludesFile = context.asAbsolutePath("./definitions/__functions.asp");
		var objectIncludesFile = context.asAbsolutePath("./definitions/__objects.asp");

		includes.set("Global", new IncludeFile(functionIncludesFile));
		includes.set("ObjectDefs", new IncludeFile(objectIncludesFile));

		addRegionHighlights(context);

		context.subscriptions.push(
			hoverProvider,
			completionProvider,
			symbolsProvider,
			signatureProvider,
			definitionProvider,
			colorProvider
		);
	} catch (error) {
		output.appendLine(error);
	}

}
