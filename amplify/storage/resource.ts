import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: "thDrive",
  access: (allow) => ({
    "public/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write"])
    ],

    "protected/*": [
      allow.authenticated.to(["read", "write"])
    ],

    // 🔥 matches: c7534ee4-6115-48ac-a929-2e3f9ff9c770/<file>
    "*/*": [
      allow.authenticated.to(["read", "write"])
    ]
  })
});