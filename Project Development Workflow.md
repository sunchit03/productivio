# Project Development Workflow

This document outlines the guidelines and conventions to ensure a smooth and consistent development process.

---

## Branch Naming Conventions

When creating a branch, follow these naming patterns based on the type of task:

1. **Feature Branches**:  
   Use the following format:
   `feature/issueXX-{person's name}`
   Example: `feature/issue01-john`

2. **Hotfix Branches**:  
  Use the following format:
  `hotfix/issueXX-{person's name}`
  Example: `hotfix/issue15-emily`

---

## Pull Request Guidelines

1. **Creating Pull Requests (PRs)**:  
- Always create a pull request for the issues assigned to you.  
- Add a clear and concise description of the changes made.  
- Mention the issue number in the PR title and description (e.g., "Fixes #01").  

2. **Naming the Pull Request**:  
Use the branch name as the title of the pull request.  

3. **Review Process**:  
- All PRs **must be reviewed** by at least one team member who is not the author.  
- Address all comments or suggestions provided during the review.  

4. **Merging PRs**:  
- A PR can only be merged once it has been reviewed and approved.  
- Ensure all tests pass before merging.  

---

## Code Review Checklist

Before submitting a PR for review, ensure:  
- Your branch is up-to-date with the main branch.  
- Code is formatted properly and adheres to the project's coding standards.  
- No linting or testing errors remain.  

---

## General Best Practices

- Write modular and reusable code.  
- Always link the PR to the corresponding issue in GitHub.  
- Communicate any blockers or delays with the team.    
