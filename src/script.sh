for file in "$@"
do
	mv "$file" "${file/.jsx/.tsx}"
done