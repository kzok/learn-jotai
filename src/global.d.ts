declare module "*.module.scss" {
  declare const value: Readonly<Record<string, string>>;
  export default value;
}
