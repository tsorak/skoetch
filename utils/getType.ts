export default function getType(type: unknown) {
    return Object.prototype.toString.call(type).split(" ")[1].split("]")[0].toLowerCase();
}