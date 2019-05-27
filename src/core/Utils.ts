export const GetSubProperty = (path: string, obj: object): any => {
    if (path === "") {
        return obj;
    } else {
        return path.split(".").reduce((prev: any, curr: any) => {
            return prev ? prev[curr] : undefined;
        }, obj || self);
    }
};
