# Git segédlet

## Gitről

A *git* egy verziókezelő rendszer, amelynek segítségével lehetőségünk van forráskódunk változásait követni, csapatmunka esetén a változtatásokból
fakadó ütközéseket feloldani, stb.

Git esetén a forráskódot több helyen tároljuk. Ezeket a tárolókat *repository*-nak nevezzük.

Egy forráskódot git segítségével nagyon változatosan kezelhetünk, de a legáltalánosabb, hogy van egy *remote (távoli)* repository, illetve több
fejlesztői gépen 1-1 *local (helyi)* repository. A változtatásainkat először a gépünkön, a lokális repo-ban végezzük el, majd ezeket a változtatásokat
*push*-oljuk a távoli repo-ba. Ha a távoli kód változik, akkor *pull* segítségével szinkronizálhatjuk a kódunkat a távoli kóddal. Ebből fakadhatnak
a *conflict-ok (ütközések)*.

A kódon végzett változtatásokat *commit* nevű egységekben tároljuk. A repo-kban ezek a commitok is eltárolódnak, így lehetőségünk van visszanézni
korábbi verziókat, esetleg rögtön visszaállni korábbi verziókra.

A commit-ok egy gráfban helyezkednek el, amely nagyon hasonló a fákhoz, ebből fakad a *branch* elnevezés, ha a commitok időnként elágaznak. Ezek nagyon
fontos részei a git használatának, de ezen segédlet nem tér ki rá.

## Lokális használat

(Ebben a részben feltétel, hogy már egy git repoban helyezkedjünk el a parancssorunkkal. Ezt vagy egy távoli repo lehúzásával, vagy egy meglévő kódbázison
a ```git init``` parancs kiadásával érhetjük el.)

Általánosságban a lokális reponk állapotáról a ```git status``` parancs kiadásával értesülhetünk. Itt olyan információkat tudunk megszerezni, hogy jelenleg
melyik branchen helyezkedünk el, vagy mennyivel vagyunk lemaradva vagy előre egy távoli repóhoz képest, ha van ilyen, vagy mely fájlokban vannak változtatásaink.
(Windows használata esetén a ```gitk --all``` parancs kiadásával megtekinthetjük a reponak a gráfját is, illetve az egyes commitok részleteit, stb. A gitk
windowson települ a git telepítésével, más operációs rendszereken külön kell telepíteni. A gráf megtekintéséhez, vagy a git kezeléséhez ma már rengeteg eszköz
létezik. Gyakran integrálva vannak a fejlesztői környezetekbe, de most egy parancssoros használatot mutatunk be. Egy jó vizuális eszköz a SourceTree nevű termék
az Atlassiantól.)

A változtatásaink több állapotban is lehetnek:

1. Nincs változtatás: Ezt azért emeljük ki, hogy később fel tudjuk használni. Gyakorlatilag a változtatás itt nem létezik.
2. *Untracked*: Új fájl létrehozása esetén ezt még nem verziókezeli a git.
3. *Unstaged changes*: Olyan változtatások, amelyekről értesül a git, de a felhasználó még nem készítette elő commitra. (Erre azért lehet szükség, mert
    előfordulhat, hogy szép, izolált commitokat szeretnénk létrehozni, de egyszerre több dolgot is változtatunk, habár azoknak külön-külön is lenne értelme.
    Itt érdemes megjegyezni, hogy nem szükséged egész fájlokat stagelnünk, megtehetjük, hogy azoknak csak részeit stageljük.)
4. *Staged changes*: Olyan változtatások, amelyeket commitolva lesznek egy commit létrehozása után.
5. Commitolt változtatások: Ezeket már nem látjuk a ```status``` használatakor. Már a kódbázis részeként kezelt változtatások.

A következő parancsokkal tudjuk mozgatni ezek között az állapotok között a változtatásainkat:

- változtatás: (ez még nem parancs, de a teljesség kedvéért felsoroljuk) 1 -> (2|3).
- ```git add ${fájlnév vagy regex}```: (2|3) -> 4
- ```git commit```: 4 -> 5. A parancs kiadásakor egy default szövegszerkesztőben (Alapértelmezetten vim. Ebből kilépni úgy tudunk, hogy Esc után, ha menteni
    is akarunk, akkor ZZ, ha csak kilépni, akkor a ZQ gombokat lenyomjuk.) commit üzenetet adhatunk meg. Ennek a célja, hogy az üzenet leírja, hogy a commit
    milyen változtatásokról szól. Az üzenetet a ```-m``` kapcsoló után is beírhatjuk.
- ```git checkout -- ${fájlnevek}```: (2|3) -> 1. A checkout parancsot óvatosan használjuk. Ha rosszul használjuk, akkor változásaink elveszhetnek.
- ```git reset -- ${fájlnevek}```: 4 -> (2|3). Ez az úgynevezett soft reset. Itt nem veszik el változtatásunk.
- ```git reset --hard -- ${fájlnevek}```: 4 -> 1. Veszélyes parancs, a módosítások elvesznek.
- ```git reset HEAD~${n}```: 5 -> 4. n db commit eldobása, és azok változtatásainak 4. fázisba helyezése.
- ```git reset --hard HEAD~${n}```: 5 -> 1. n db commit eldobása.

A felsorolt parancsok megfelelő kapcsolókkal még rengeteg mindenre jók. Ezek talán a legalapabb műveletek.

## *Távoli* használat

A cím megtévesztő. Ez a szakasz valójában a távoli és a lokális repo közötti műveletekről szól.

A legfontosabb parancsok:

- ```git push```: Commitolt változtatások feltolása a távoli repoba. Időnként előfordulhat, hogy ezt visszautasítja a távoli repo. Ennek a leggyakoribb oka, hogy
    a még nem pusholt változtatások kezdőpontja más, mint a távoli repo legfrissebb commitja.
- ```git pull```: Lokális repo szinkronizálása a távoli repoval. Ez konfliktust eredményezhet, ezért nem mindig sikerül végrehajtani.
- ```git fetch```: Lokális repo frissítése a távoli repo változtatásaival, anélkül, hogy azokat szinkronizálná is.

A távoli repoval való kommunikációra általában az első két parancs szolgál, de időnként az utolsót is használjuk. A megfelelő kapcsolókkal ezeknek a működése
rengeteg módon változtatható.

## Konfliktusok feloldása

A konfliktusok feloldására két fő stratégia van ez a *merge* és a *rebase*. Előbbi gondolata, hogy a konfliktus létezik, oldjuk fel egy újabb committal, míg utóbbi
mögötti gondolat az, hogy próbáljuk meg elkerülni a konfliktust, alkalmazzuk úgy a változtatásokat, mintha a korábbi commitra épült volna az újabb commit, ha ez
nem sikerül, akkor módosítsuk úgy az új commitot, mintha nem is lett volna konfliktus. Mind a két stratégia hasznos tud lenni. Előbbi átlátható az egyes
módosítások szempontjából, míg utóbbi kevesebb konfliktussal, lineárisabb történelmet biztosít.

Az eredmény mindkét stratégia esetén a kód szempontjából megegyezik. A különbség csak a fent leírtakban van. Ezeket a műveletek elvégzésénél, illetve a kód
történelmének vizsgálatánál észleljük csak.

(Ez a segédlet a rebase-t javasolja, mint alapvető taktikát, ez általában kevesebb konfliktusos helyzettel jár. Pull esetén az alapértelmezett művelet a merge,
ezt a következő parancs kiadásával írhatjuk felül: ```git config --global pull.rebase true```.)

A konfliktusok esetén az alapvető helyzet a következő. Van néhány lokális commitunk, de közben a távoli repon is jelentek meg új commitok. Szeretnénk pusholni, de
nem tudunk. Először pullolnunk kell... (A pull-t követően előfordulhat, hogy minden rendben megy, és már pusholhatunk is, a következő fejezetek arról szólnak,
hogy mi a teendő, ha nem ez történik.)

### Merge stratégia

... Kiadjuk a pull parancsot (a fenti config beállítása nélkül). A konzolon megjelenik a ```CONFLICT``` szó, majd utána néhány fájlnév.
Ekkor a fájlokban a következőhöz hasonló blokkokat találhatunk:

```
<<<<<<< HEAD:mergetest
This is my third line
=======
This is a fourth line I am adding
>>>>>>> 4e2b407f501b68f8588aa645acafffa0224b9b78:mergetest
```

Végezzük el kézzel a változtatások összeolvasztását. Erre nincs különleges recept. Fejlesztőként, vagy a verziókezelt forrás egyik hozzájárulójaként döntéseket kell
hoznunk, hogy a két kódból mit kell megtartani, mit kell átalakítani. Ha egy fájlon belül minden conflicttal megvagyunk, akkor töröljük le a git által beillesztett
jelölőket. Addoljuk a fájlokat. Ha minden konfliktusos fájllal végeztünk, akkor hozzunk létre egy commitot. Remélhetőleg ez idő alatt nem került újabb commit a
távoli repoba. Most már tudunk pusholni.

### Rebase stratégia

... Kiadjuk a pull parancsot (a fenti config beállítása után). A konzolon megjelenik a ```CONFLICT``` szó, majd utána néhány fájlnév.
Ekkor a fájlokban a következőhöz hasonló blokkokat találhatunk:

```
<<<<<<< HEAD:mergetest
This is my third line
=======
This is a fourth line I am adding
>>>>>>> 4e2b407f501b68f8588aa645acafffa0224b9b78:mergetest
```

Végezzük el a változtatások összeolvasztását (lsd. előző fejezet a commit létrehozásáig). Ha a változtatásokat add-oltuk (fontos, hogy ne commitoljunk),
akkor a ```git rebase --continue``` parancs kiadásával folytathatjuk a rebase-t. Ekkor újabb conflictok tűnhetnek fel. Iteráljunk addig, ameddig conflictok
vannak. Ha már nincsenek, akkor a változtatásaink készen állnak a push-ra. Remélhetőleg itt sem jelentek meg újabb commitok a távoli repoban.


## Hivatkozások

- [Try git](https://try.github.io/)
- [Git guide](http://rogerdudler.github.io/git-guide/)
- [Pro Git book](https://git-scm.com/book/en/v2/)
- [Munkafolyamatok](https://www.atlassian.com/git/tutorials/comparing-workflows)


## Közös munkafolyamat git-ben (példa)

Alfa és Béta közös munkája, rebase alapon.

<table>
<tr>
<th>Alfa</th>
<th>Béta</th>
</tr>

<!---------------------------------- Új sor ------------------------------------->
<tr><td><!-- Alfa -->

- Új repo létrehozása a Github-on
- [Create a new repository](https://github.com/new)
- Adjunk nevet a repo-nak
- `Create repository`
- Béta felvétele (Settings/Collaborators/Add collaborator)

</td><td><!-- Béta -->



</td></tr>
<!-- Sor vége -->

<!---------------------------------- Új sor ------------------------------------->
<tr><td><!-- Alfa -->

- `git clone https://github.com/<alfa>/<repo>.git repo-alfa`
- `cd repo-alfa`
- `fruits.txt` fájl szerkesztése

```txt
alma
körte
```

- `git status`
- `git add fruits.txt`
- `git commit -m"Initial commit"`
- Harmadik sor hozzáadása a `fruits.txt`-ben

```txt
alma
körte
szilva
```

- `git status`
- `git add fruits.txt`
- `git commit -m"szilva hozzáadva"`
- `git remote -v`
- `git push -u origin master`
- Github oldal frissítése

</td><td><!-- Béta -->



</td></tr>
<!-- Sor vége -->

<!---------------------------------- Új sor ------------------------------------->
<tr><td><!-- Alfa -->



</td><td><!-- Béta -->

- `git clone https://github.com/<alfa>/<repo>.git repo-beta`
- `cd repo-beta`
- Könyvtár listázása
- `fruits.txt` szerkesztése

```txt
alma
körte
szilva
barack
```

- Új fájl hozzáadása: `vegetables.txt`

```txt
répa
krumpli
```

- `git status`
- `git add .`
- `git commit -m"barack és zöldségek hozzáadása"`
- `git push -u origin master`

</td></tr>
<!-- Sor vége -->

<!---------------------------------- Új sor ------------------------------------->
<tr><td><!-- Alfa -->

- Repo frissítése
- `git pull --rebase origin master`

</td><td><!-- Béta -->



</td></tr>
<!-- Sor vége -->


<!---------------------------------- Új sor ------------------------------------->
<tr><td><!-- Alfa -->

- `fruits.txt` fájl 3. sorának szerkesztése
- `git add fruits.txt`
- `git commit -m"alfa 1. módosítás"`
- `fruits.txt` fájl 3. sorának szerkesztése
- `git add fruits.txt`
- `git commit -m"alfa 2. módosítás"`

</td><td><!-- Béta -->

- `fruits.txt` fájl 3. sorának szerkesztése
- `git add fruits.txt`
- `git commit -m"béta 1. módosítás"`
- `fruits.txt` fájl 3. sorának szerkesztése
- `git add fruits.txt`
- `git commit -m"béta 2. módosítás"`

</td></tr>
<!-- Sor vége -->

<!---------------------------------- Új sor ------------------------------------->
<tr><td><!-- Alfa -->

- `git push`
- OK

</td><td><!-- Béta -->



</td></tr>
<!-- Sor vége -->

<!---------------------------------- Új sor ------------------------------------->
<tr><td><!-- Alfa -->



</td><td><!-- Béta -->

- `git push`
- Rejected, mivel az origin előrébb van
- `git pull --rebase`
- Conflict 1.
- `git status`
- Konfliktus feloldása (VSCode segít, de gyakorlatilag a fájl szerkesztése)
- `git add fruits.txt`
- `git status`
- `git rebase --continue`
- Conflict 2.
- `git status`
- Konfliktus feloldása
- `git add fruits.txt`
- `git status`
- `git rebase --continue`
- `git push`

</td></tr>
<!-- Sor vége -->

<!---------------------------------- Új sor ------------------------------------->
<tr><td><!-- Alfa -->

- `git pull --rebase`

</td><td><!-- Béta -->



</td></tr>
<!-- Sor vége -->
 
</table>
