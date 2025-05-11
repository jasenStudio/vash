export function getDeviceType(): string {
  const userAgent = navigator.userAgent.toLowerCase();

  if (/tablet|ipad|playbook|silk|kindle/i.test(userAgent)) {
    return "Tablet";
  } else if (
    /mobile|iphone|ipod|android|blackberry|windows phone/i.test(userAgent)
  ) {
    return "Mobile";
  } else {
    return "Desktop";
  }
}
