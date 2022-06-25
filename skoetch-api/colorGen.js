
const HEXCOLORS = {
    BLACK: "#000",
    RED: "#f00",
    GREEN: "#0f0",
    BLUE: "#00f"
}; Object.freeze(HEXCOLORS);

const availableColors = ["RED", "GREEN", "BLUE"];

function getAvailableColor() {
    const color = (availableColors.length > 0) ? availableColors.pop() : "BLACK";
    return color;
}

const getColor = () => {
    return HEXCOLORS[getAvailableColor()];
}

export {
    getColor
}