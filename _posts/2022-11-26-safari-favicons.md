---
title: Safari Favicons
date: 2022-11-26 19:10:00 -0500
categories: [Tech]
tags: [apple,safari]     # TAG names should always be lowercase
---

Safari tends to not look for updated favicons for websites and simply relies on its own local cache. To remove the cache and get updated favicons, do the following:

1. In Finder's Go menu, select "Go to Folder..." or `⇧⌘G`
2. Go to `~/Library/Safari/Favicon Cache`
3. Delete the the content of the folder

If your Terminal has full disk access enabled via System Settings, you could just run this command in the termnal.

```bash
rm -r ~/Library/Safari/Favicon\ Cache/*
```
