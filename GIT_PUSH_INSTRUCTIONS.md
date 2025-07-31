# How to Push Your Portfolio Website to GitHub

Follow these steps to push your local portfolio website files to a GitHub repository:

## Prerequisites
- Git installed on your computer. Download from https://git-scm.com/downloads if not installed.
- A GitHub account.

## Steps

1. Open a terminal or command prompt.

2. Navigate to your portfolio website directory:
```
cd C:/Users/DELL/Desktop/portfolio-website
```

3. Initialize a new Git repository (if not already initialized):
```
git init
```

4. Add all files to the repository:
```
git add .
```

5. Commit the files:
```
git commit -m "Initial commit of portfolio website"
```

6. Create a new repository on GitHub:
- Go to https://github.com and log in.
- Click the "+" icon and select "New repository".
- Name it (e.g., `portfolio-website`).
- Set it to Public.
- Click "Create repository".

7. Link your local repository to the GitHub repository:
```
git remote add origin https://github.com/yourusername/portfolio-website.git
```
Replace `yourusername` with your GitHub username.

8. Push your files to GitHub:
```
git branch -M main
git push -u origin main
```

9. Enable GitHub Pages in your repository settings (see README.md for details).

Your portfolio website will be live at:
```
https://yourusername.github.io/portfolio-website/
```

Replace `yourusername` with your GitHub username.

If you need help with any of these steps, feel free to ask!
