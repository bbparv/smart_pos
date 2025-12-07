export const createAuditLog = async (prisma, userId, action, entity, entityId, changes = null) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        changes: changes ? JSON.stringify(changes) : null
      }
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
};
