export const authorizeRole = (...roles) => {

    return (req, res, next) => {

        if (!roles.includes(req.user.id_role)) {
            return res.status(403).json({
                message: "Anda tidak memiliki hak akses"
            });
        }

        next();

    };

};