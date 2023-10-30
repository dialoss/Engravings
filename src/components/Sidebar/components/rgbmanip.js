function stringToRGB(rgbStr) {
    return rgbStr.match(/\d+/g).map(Number);
}

export function darkenColor(color, factor) {
    let colorArray = stringToRGB(color);
    colorArray = colorArray.map(color => color * (1 - factor));
    return `rgb(${colorArray[0]}, ${colorArray[1]}, ${colorArray[2]})`;
}