# Markdown files viewer (README.md)

The idea of this service is to provide HTML only solution for documenting with **markdown**.
The MD files are rendered with in browser javascript library https://marked.js.org/ 

## Structure

### index.html

Shows the "table of contents". Links to all the MD files as rendered or raw.
**NOTE** this relies on the fileslist.txt file to be up to date. It only should include the list of files in the files directory.

### fileslist.txt

````
cat fileslist.txt 
adapter.md
mvc.md
sample.md

# Update if files changed:
ls files > fileslist.txt
````

### files -directory

Place the actual data here - the documentation formatted as markdown.

### Accessing single MD files

https://.../mdfiles?

