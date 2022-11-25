---
title: Site Setup
date: 2022-11-25 13:16:00 -0500
categories: [Tech]
tags: [jekyll]     # TAG names should always be lowercase
---

This site is build using [Jekyll](https://jekyllrb.com), using the [Chirpy theme](https://github.com/cotes2020/jekyll-theme-chirpy/), and is hosted on [Github Pages](https://pages.github.com). This [video](https://www.youtube.com/watch?v=F8iOU1ci19Q) was helpful in both finding the theme and seeing the basic setup.

# Installing Ruby

Jekyll requires ruby to build the site and run a local server for testing. Jekyll provides [documentation](https://jekyllrb.com/docs/installation/macos/) on this process for installing dependancies with [brew](https://brew.sh/).

# Setting Up Chirpy

The developer of Chirpy provides a [Starter](https://github.com/cotes2020/chirpy-starter/generate) which can be used via GitHub to initialize the repo for use.

Once a project is created with the Starter, it can be cloned locally, then the following command can be run from inside the project folder to build the project.

```bash
bundle
```

Once finished, a local server can be started to test out the site and see how it will look. This can be run anytime change are being made, so they can be tested before pushing the changes to GitHub.

```bash
bundle exec jekyll s
```

## Update Site Settings

The `_config.yml` file can be used to customize the site, such as setting the title, avatar, contact info, etc. After updating this file you may need to restart the local server (using the above command) for your changes to take effect.

## Adding Posts

To make a new blog entry, add a new markdown file to the `_posts` folder, using the filename format: `YYYY-MM-DD-title.md`.

Each file should contain [front matter](https://jekyllrb.com/docs/front-matter/) at the top of the file to tell Jekyll some information about the post.

```markdown
---
title: Example Post
date: 2022-12-25 12:00:00 -0500
categories: [Category1,Category2]
tags: [tag1,tag2]     # TAG names should always be lowercase
---
```

> **If Your Post Isn't Showing Up**
>
>If using a date in the front matter, your post will not display if the date is in the future. If your post isn't showing up, this may be why. This can be used to as a means to schedule posts for the future. Some other reasons can be found on [Stackoverflow](https://stackoverflow.com/questions/30625044/jekyll-post-not-generated).
{: .prompt-tip }


[Chirpy's Blog](https://chirpy.cotes.page) has some additional information.

> [Chirpy Markdown Syntax Reference](https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/_posts/2019-08-08-text-and-typography.md)
{: .prompt-info }

# Deploying to GitHub Pages

Chirpy comes with a preconfigured GitHub workflow to build and deploy the site on GitHub Pages. Committing your change and pushing the code to GitHub should kick off the workflow.

#### Build Errors

If you receive the following build error:

```
Error: The process '/opt/hostedtoolcache/Ruby/3.1.2/x64/bin/bundle' failed with exit code 16
  at ExecState._setResult (/home/runner/work/_actions/ruby/setup-ruby/v1/dist/index.js:5340:25)
  at ExecState.CheckComplete (/home/runner/work/_actions/ruby/setup-ruby/v1/dist/index.js:5323:18)
  at ChildProcess.<anonymous> (/home/runner/work/_actions/ruby/setup-ruby/v1/dist/index.js:5217:27)
  at ChildProcess.emit (node:events:390:28)
  at maybeClose (node:internal/child_process:1064:16)
  at Process.ChildProcess._handle.onexit (node:internal/child_process:301:5)
```

Run the following command in your project folder via the Terminal.

```bash
bundle lock --add-platform x86_64-linux
```

Commit and push the updated Gemfile.lock and the build should succeed.
