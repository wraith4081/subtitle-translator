export default function parseJSON(content: string) {
    try {
        return {
            success: true,
            content: JSON.parse(content)
        };
    } catch (error) {
        return {
            success: false,
            content: null
        };
    }
}