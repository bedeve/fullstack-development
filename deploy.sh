yarn docz build 
cd docs 
git add * 
git commit -m \"update\" 
git push 
cd .. 
git stash 
git add docs 
git commit -m \"update docs\" 
git push