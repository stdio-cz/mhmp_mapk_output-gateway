export const GetSubProperty = <T>(path: string, obj: object): T => {
    if (path === "") {
        return ((obj as unknown) as T);
    } else {
        return path.split(".").reduce((prev: any, curr: any) => {
            return prev ? prev[curr] : undefined;
        }, obj || self);
    }
};

/**
 * Parse string "meant to be boolean" query parameter to boolean
 * @param param Query parameter given by request, can be undefined
 * @returns {boolean} Returns true if query parameter is set to "true" case insensitive
 */
export const parseBooleanQueryParam = (param: string | undefined): boolean => {
    if (param === undefined) {
        return false;
    } else {
        return param.trim().toLowerCase() === "true" ? true : false;
    }
};
