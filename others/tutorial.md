# Közös munkafolyamat leírása

## Repo létrehozása

- github.com
- [Create a new repository](https://github.com/new)
- Adjunk nevet
- `Create repository`

## Alfa

```bat
git clone https://github.com/horvathgyozo/git-basic-tutorial.git
cd .\git-basic-tutorial\
```

```md
# Git Basic Tutorial
```

```bat
git status
git add .\README.md
git commit -m"Initial commit"
```

```md
# Git Basic Tutorial

I like apples.
```

```bat
git status
git add .\README.md
git commit -m"i like apples"
git remote -v
git push -u origin master
```

Github frissítése

## Béta

git clone https://github.com/horvathgyozo/git-basic-tutorial.git git-beta
cd .\git-beta\
ls
code .\README.md

```md
# Git Basic Tutorial

I like apples, too.

And I like pears.
```

code apple.txt

```txt
golden
johnatan
starking
```

git status
git add .
git commit -m"add apples"
git push -u origin master

## Alfa

git pull --rebase origin master

```md
# Git Basic Tutorial

I like apples and grapes.

And I like pears.
```

git add .
git commit -m"add oranges"

```md
# Git Basic Tutorial

I like apples and grapes and oranges.

And I like pears.
```

git add .
git commit -m"add grapes"
git push

## Béta

```md
# Git Basic Tutorial

I like apples and oranges.

And I like pears.
```

git add .
git commit -m"add oranges"
git push

--> rejected...

git pull --rebase

--> conflict
--> resolve config (VSCode-ban könnyű)

git add README.md
git rebase --continue
