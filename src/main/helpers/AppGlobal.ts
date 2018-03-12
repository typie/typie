
export default class AppGlobal
{
    private static startTime: number;
    public static settings: object;

    public static init() {
        AppGlobal.startTime = Date.now();
    }

    public static getTimeSinceInit() {
        return Date.now() - AppGlobal.startTime;
    }
}