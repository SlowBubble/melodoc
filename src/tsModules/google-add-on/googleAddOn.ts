declare const google: any;

export function isInGoogleAddOn() {
  return typeof google !== 'undefined';
}