const BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function encodeStringToBase62(input: string): string {
    let number = 0;
    for (let i = 0; i < input.length; i++) {
        number = (number << 8) + input.charCodeAt(i);
    }
    return encodeBase62(number);
}

function encodeBase62(number: number): string {
    if (number === 0) return "0";
    let result = [];
    while (number > 0) {
        const remainder = number % 62;
        result.push(BASE62.charAt(remainder));
        number = Math.floor(number / 62);
    }
    return result.reverse().join('');
}

export function decodeFromBase64(base64: string): string {
    const decoded = atob(base64);
    let result = '';
    
    for (let i = 0; i < decoded.length; i++) {
      const char = decoded.charCodeAt(i).toString(16).padStart(2, '0');
      result += `%${char}`;
    }
    
    return decodeURIComponent(result);
  }