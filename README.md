# Cloud-app-printing-multiple-slips-per-page

The app allows printing from Alma's Printout Queue, with few printouts on one page. It has 4 built-in templates: 2 columns, 3 columns, and 4 columns. It also has a template for 1 column which helps when the printouts are short and then additional printouts can fit into the page, one below the other. Actually, the same goes for the 2/3/4 columns templates: if there is enough space on the page for another row the row is added. Selecting the template is done in the Settings section.

If non of the built-in templates are suitable for your needs, you can create your own. Under Configuration (available for admin users) - you can create a custom template. Use the folder button to open a template as a starting point, provide a name and save. Technical details below.

To report a problem, please open an issue by clicking <a translate href="https://github.com/ExLibrisGroup/Cloud-app-printing-multiple-slips-per-page/issues" target="_blank">here</a>.

# How to create customized templates

The printouts are received from Alma as HTML snippets and placed into DIV elements, one after the other. Each div has the class "letter".
Each row of "letters" is surrounded by an additional DIV, which has the class "row".

A template is actually the CSS that positions and styles those DIVs.
Start your own templates by choosing one of the built-in templates, For example "Standard 2 per line format" showen below:

	.row {
		display: grid;
		grid-template-columns: 49% 49%;
	}
	.letter {
		border: 1px solid rgba(0, 0, 0, 0.1);
		padding: 5px;
		word-break: break-word;
	}
	@media print {
		.row {
			break-inside: avoid;
		}
	}
Class "row" defines how many letters will be in each row. In this example 'grid-template-columns: 49% 49%' means that there are 2 slips per row, each taking 49% of the width of the page. Please note that the app uses this line also for determining how many DIVs of class "row" to place in the DIV of class "letter".

In the "letter" class we can change the style of the individual printouts. We used here a light gray 1px border. If you like to make the border thicker you might need to change the grid's style to "48% 48%" since the border takes up space in the overall 100% of the page.

The last part (@media print) makes sure that when the printouts are actually printed (or Print-preview) the 2nd row will be placed on the same page as the 1st row, only if there is enough space for it there. If not, it is moved to the top of the 2nd page.
