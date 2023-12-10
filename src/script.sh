files=$(find . -type f | egrep ".ts$")
for file in "$files"
do
	#if ! grep -q "//@ts-nocheck" $file ; then
	
	sed -i '1i\//@ts-nocheck' $file
	#fi
done