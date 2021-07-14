function round(num) {
    return Math.round(num * 100) / 100
}

function getDate() {
    var dt = new Date();
    return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
}

function getHours() {
    var dt = new Date();
    return dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
}

function getMinutes() {
    var dt = new Date();
    return (dt.getHours() * 60) + dt.getMinutes();
}

function removeArrayItem(array, item) {
    const index = array.indexOf(item);
    if (index > -1) {
        array.splice(index, 1);
    }
    return array;
}