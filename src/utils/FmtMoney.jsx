export function comma(m) {
    return m.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}