Thanks for considering contributing and helping us on creating the Cardano Constitution Voting App!

This document contains guidelines to help you get started and how to make sure your contribution gets accepted.

## Table of Contents

- [Contributing to the `Cardano Constitution Voting App` project](#contributing-to-the-cardano-constitution-voting-app-project)
  - [Table of Contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [I Want To Contribute](#i-want-to-contribute)
    - [Before Submitting a Bug Report](#before-submitting-a-bug-report)
    - [How Do I Submit a Good Bug Report?](#how-do-i-submit-a-good-bug-report)
    - [Your First Code Contribution](#your-first-code-contribution)
  - [Working Conventions](#working-conventions)
    - [Pull Requests](#pull-requests)
    - [Branch Naming](#branch-naming)
    - [Commit Messages](#commit-messages)
      - [Rationale](#rationale)
    - [Merge Commit PRs](#merge-commit-prs)
      - [Rationale](#rationale-1)
  - [Development Processes](#development-processes)
    - [Developer workflow](#developer-workflow)

## Code of Conduct

This project and everyone participating in it is governed by Intersect's [Code of Conduct](./CODE-OF-CONDUCT.md).
By participating, you are expected to uphold this code.

## I Want To Contribute

#### Before Submitting a Bug Report

A good bug report shouldn't leave others needing to chase you up for more information.
Therefore, we ask you to investigate carefully, collect information and describe the issue in detail in your report.
Please complete the following steps in advance to help us fix any potential bug as fast as possible.

- Make sure that you are using the latest version.
- Determine if your bug is really a bug and not an error on your side.
  e.g. using incompatible environment components/versions.
- Also make sure to search the internet (including Stack Overflow)
  to see if users outside of the GitHub community have discussed the issue.
- Collect information about the bug:
  - Stack trace (Traceback)
  - OS, Platform and Version (Windows, Linux, macOS, x86, ARM)
  - Version of the interpreter, compiler, SDK, runtime environment, package manager, depending on what seems relevant.
  - Possibly your input and the output
  - Can you reliably reproduce the issue? And can you also reproduce it with older versions?

#### How Do I Submit a Good Bug Report?

We use GitHub issues to track bugs and errors. If you run into an issue with the project:

- Open an [Issue](https://github.com/ClearContracts/cardano-constitution-voting-app/issues).
  (Since we can't be sure at this point whether it is a bug or not, we ask you not to talk about a bug yet and not to label the issue.)
- Explain the behavior you would expect and the actual behavior.
- Please provide as much context as possible.
  Describe the _reproduction steps_ that someone else can follow to recreate the issue on their own.
  This usually includes your code.
  For good bug reports you should isolate the problem and create a reduced test case.
- Provide the information you collected in the previous section.

Once it's filed:

- The project team will label the issue accordingly.
- A team member will try to reproduce the issue with your provided steps.
  If there are no reproduction steps or no obvious way to reproduce the issue, the team will ask you for those steps.
- The issue will then be left to be [implemented by someone](#your-first-code-contribution).

#### Your First Code Contribution

## Working Conventions

### Pull Requests

Thank you for contributing your changes by opening a pull requests!

To get something merged we usually require:

- Follow the Pull Request template
- Description of the changes - if your commit messages are great, this is less important
- Quality of changes is ensured - through new or updated automated tests
- Change is related to an issue, feature (idea) or bug report - ideally discussed beforehand
- Well-scoped - we prefer multiple PRs, rather than a big one

Please reuse the branch naming for the pull request naming.

### Branch Naming

- When creating your branches please create informative names.
- Using prefixes such as `feat/`, `fix/`, `chore/`, `docs/` for branch names are a good start.
- Using the related issue number after the prefix is required.

Examples:

- `feat/123-added-ability-for-dreps-to-change-drep-id`
- `fix/312-fixed-drep-ids-being-reversed`
- `chore/567-bumped-cardano-node-version-to-9`
- `docs/88-tweak-contributing-pr-template-codeowners`

### Commit Messages

Please make informative commit messages!
It makes it much easier to work out why things are the way they are when you’re debugging things later.

A commit message is communication, so as usual, put yourself in the position of the reader: what does a reviewer, or someone reading the commit message later need to do their job?
Write it down!
It is even better to include this information in the code itself, but sometimes it doesn’t belong there (e.g. ticket info).

Also, include any relevant meta-information, such as issue numbers.
If a commit completely addresses a issue, you can put that in the headline if you want, but it’s fine to just put it in the body.

Here are seven rules for great git commit messages:

1. Separate subject from body with a blank line
2. Limit the subject line to 50 characters (soft limit)
3. Capitalize the subject line
4. Do not end the subject line with a period
5. Use the imperative mood in the subject line and suffix with ticket number if applicable
6. Wrap the body at 72 characters (hard limit)
7. Use the body to explain what and why vs. how

There is plenty to say on this topic, but broadly the guidelines in [this post](https://cbea.ms/git-commit/) are good.

#### Rationale

Git commit messages are our only source of why something was changed the way it was changed.
So we better make the readable, concise and detailed (when required).

### Merge Commit PRs

When closing branches / PRs use merge commits, so we have a history of PRs also in the git history.
Try to keep branches up-to-date with main (not strict requirement though).
Once merged to main, please delete the branch.

#### Rationale

Keeping branches ahead of main not only make the git history a lot nicer to process, it also makes conflict resolutions easier.
Merging main into a branch repeatedly is a good recipe to introduce invalid conflict resolutions and loose track of the actual changes brought by a the branch.

## Development Processes

### Developer workflow

- Create [well named](#branch-naming) branch from `main` add changes, then make a pull request back to the `main` branch.
- If the changes are not ready for review then feel free to create a draft PR, and link this to the ticket/issue.
- Developers should review each other's pull requests, and should be requested via [CODEOWNERS](./CODEOWNERS).
- After a review remember to address all the requests of changes since they are blocking PR from being merged.
- Once tests pass and peer review is done the branch can be merged into `main` by author and will be deployed automatically.
