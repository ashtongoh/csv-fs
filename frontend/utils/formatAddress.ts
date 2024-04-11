export const formatAddress = (str: string) => {
    const firstThree = str.substring(0, 5);
    const lastThree = str.substring(str.length - 3);
    return `${firstThree}....${lastThree}`;
}