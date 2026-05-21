const CrudRepository = require("./crud-repository");
const { PushToken } = require("../models");
class NotificationRepository extends CrudRepository {
  constructor() {
    super(PushToken);
  }

  async savePushToken(data) {
    try {
      const now = new Date();
      const response = await PushToken.upsert({
        token: data.token,
        userId: data.userId,
        platform: data.platform ?? "web",
        isActive: true,
        lastUsedAt: now,
        updatedAt: now,
      });

      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = NotificationRepository;
