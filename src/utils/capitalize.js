/**
 * Capitalizes string
 *
 * @param {string} str
 * @returns {string}
 */
export default function capitalize(str: string): string | void	{
    if(typeof str ===  "string"){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
