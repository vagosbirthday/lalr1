# 🦜 Quetzal Syntactic Analyzer

LALR(1) parser + lexter implementation for the [Quetzal language](https://arielortiz.info/s202211/tc3048/quetzal/quetzal_language_spec.html).

Developed by **Daniel** and **Kirill**.

## Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

### How to run

You can run the parser against specific Quetzal source files using `ts-node`:

```bash
npx ts-node src/main.ts samples/file.quetzal
```

For example:

```bash
npx ts-node src/main.ts samples/001_hello.quetzal
```