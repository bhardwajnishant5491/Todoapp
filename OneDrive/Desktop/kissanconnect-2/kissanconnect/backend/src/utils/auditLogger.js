import AuditLog from '../models/AuditLog.js';

const detectDeviceType = (userAgent = '') => {
  const ua = String(userAgent).toLowerCase();
  if (ua.includes('mobile')) return 'mobile';
  if (ua.includes('tablet') || ua.includes('ipad')) return 'tablet';
  if (!ua) return 'unknown';
  return 'desktop';
};

export const createAuditLog = async ({ entityType, entityId, action, reason = '', actor, metadata = {}, req = null }) => {
  try {
    if (!entityType || !entityId || !action || !actor) {
      return null;
    }

    const actorIp = req?.headers?.['x-forwarded-for']?.split(',')?.[0]?.trim() || req?.ip || '';
    const actorUserAgent = req?.headers?.['user-agent'] || '';
    const actorDeviceType = detectDeviceType(actorUserAgent);

    return await AuditLog.create({
      entityType,
      entityId,
      action,
      reason,
      actor,
      actorIp,
      actorUserAgent,
      actorDeviceType,
      metadata,
    });
  } catch (error) {
    console.error('Audit logging failed:', error.message);
    return null;
  }
};
