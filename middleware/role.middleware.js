function autorizeRole(roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.sendStatus(403).json({ message: "Role Insuffisant" });
        }
        next();
    };
} module.exports = authorizeRole;