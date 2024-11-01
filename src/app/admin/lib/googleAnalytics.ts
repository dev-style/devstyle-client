"use server";

// devstyle-client/src/app/admin/lib/googleAnalytics.ts
import { BetaAnalyticsDataClient } from "@google-analytics/data";

// Assuming credentials are directly stored in this file
const credentials = {
  client_id: "111187268634259891761",
  //   client_secret: "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",
  //   redirect_uri: "https://devstyle-client.vercel.app/",
  client_email:
    "devstyle-compte-service@devstyle-425019.iam.gserviceaccount.com", // Added client_email field
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDJKK0zcooSu2sL\nh77FCO7ShkhtW+8NaPM9qjfNl0Fk6SdRVc81iyDhIICJWXjlabw9gDnPMUJ+9fZ7\n0AFNTVaQMueW3C7U0NUOsGa5fSpVyWdAvitCzWLDXEQUCmKaT/D9F0xnNcb3vAUm\nK9q5iXEJ5fT/ZZgNFN0baSpV5WcjleC8ZSGK9sPrUhQFLVIA51hOaT1SURGQWcvC\nHbS6XWfAidlNudNpHgR3mbnrwpooWRG7E0aUxQpOVM/l8YCHuZX8+NjgFnUeGKT7\ntwQkaN5clfuLvTIUnJtqACI/atFKXCkNQLID83H0z+d89bf6MfThXjJW/hBcdtsA\nn3+rMKQLAgMBAAECggEAQw3SHnIx4GilGCTZzKhbo8WrYvjgSOIRIx8YlumynMaz\nmoM2HS0Rernw3tf6Ws7SNtYFbzGGbvfigAcoR/JdxpeRZ1JiMgKi4tCejXpRoGMQ\njh5WIWCBaYnaD6wejj3ToSohB85/UplURhMcR/iuu5PyBSiCdOndgoOd3yAnL07x\nXM/BGbgfT1s4dCK/LdHl+kXsD5DQ1rlS0mXjpeyjz9Nlm0QLF+dE1rWTG8jhBhVU\n7U5yqSygbmJqrPX/qt4JoZc5i+O1jZblSGDpY77iSxQkTw9USCyas8WijOOYZ7MN\ny6Li4yFiiItxxyLWo3jg+5O0ft2JGhnB90mtK+V9sQKBgQDlNSn3p5caNYsUiEaD\n7Aton50E1rpjo6dRyQqZXb78tXTmVkgebjMfzW660o1YhMfgPo1fQxAJL68QJAwz\nO5OOSQmX3LCAalKLBh5Rw4IABLfm70OZc8w2/f9+PLrb4si9iL1DiVUUvCqBRo7e\nwh7XNvet0VuqlAMQIQWLHxur9wKBgQDgrC2GQjtA6CkDSs2YVZQy2cIvjzHlf6TX\ncS4JA1JAbgSMzEEYSE0zq52+v6H+XTStLaRlLdtsAMdwUGIqb9Ki29Zfy9CfiosT\nzdJsn3mPFJlM/G3usaGaKHQoJBVCuxZkAoBm7qCkNk177n2Pt7eRBCHA13OqPwJJ\nj3mna/c7jQKBgC6YdzakeEBYwDRlW8h31P3o7NfN+0hEPcCPmTsCZtAi52foBHND\nPdtqPOd35EopfCSnMsA59umXKwSh/2Tu6JlVWcDomW0RsEQY81L15tiwHN6yp1Br\nzQkk66qzF92Zpet5/9fZ9FTpx85OFL9OQUzJHOLWG8d6nYDK5cCZi1uTAoGATZmq\nr7C4npaRc92mXXNRmK61749aAJax7OfeqqZHBpH5aFg0M5rlb29bMMMnxJ+Uzivx\nmDDalNdAC374KQgujKm5xaS0DibgGpsAjxwV9GF9AaY+oi8gTgqi9CpiXYYZGbnz\nd5n8SjunT6L0I2ulL6Vpsx23iZnxxE6WCkm0PxECgYB9zQB6ghk1ROJDgts8Tkky\nDhrWfKS7KIyLj3/G+sELyKcBCBqz5FS1tR/l1Jnth/ukoG49TqPLZKszRJO+DcO/\nLDq8toEf+nS0sacGfvlqkYatIkPwnwyaICISSTq43nW2ZijQVAP+UR0K8EfKfBZp\nnnQQ2LDbSChWDti9gI9ipQ==\n-----END PRIVATE KEY-----\n", // Added private_key field
};

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: credentials,
});

export const getAnalyticsData = async (propertyId: string) => {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`, // Replace with your GA4 property ID
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      metrics: [{ name: "sessions" }, { name: "activeUsers" }],
      dimensions: [{ name: "date" }],
    });
    return response;
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw new Error("Failed to fetch analytics data");
  }
};
