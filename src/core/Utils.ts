export const GetSubProperty = <T>(path: string, obj: object): T => {
    if (path === "") {
        return ((obj as unknown) as T);
    } else {
        return path.split(".").reduce((prev: any, curr: any) => {
            return prev ? prev[curr] : undefined;
        }, obj || self);
    }
};
