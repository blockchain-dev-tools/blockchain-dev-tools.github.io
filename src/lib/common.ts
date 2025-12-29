export const formatJsonResult = (result: any) => {
    const jsonString = JSON.stringify(result, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    );
    return JSON.parse(jsonString);
}