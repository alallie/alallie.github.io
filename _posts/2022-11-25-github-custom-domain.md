---
title: GitHub Custom Domains
date: 2022-11-25 17:16:00 -0500
categories: [Tech]
tags: [jekyll]     # TAG names should always be lowercase
---

When changing the DNS for this site to a custom domain everything appeared to work from the network side, however when trying to load the page I would get the raw content of the index.html page, instead of the full Jekyll site.

I had a few other sites running with GitHub Pages and noticed they were working with the custom domain, which I wasn't expecting. I figured these sites, since they had common names, were conflicting with Jekyll.

Unpublishing the pages did not resolve the issue. I had to take it once step further to delete the `github-pages` entry from the Environments in the repo settings. Once that was gone and I redeployed the site, it started working.
