export const levelVariant = (level: string) => {
    switch (level.toUpperCase()) {
        case 'INFO':
            return 'success';
        case 'WARNING':
            return 'warning';
        case 'ERROR':
            return 'danger';
        case 'DEBUG':
            return 'primary';
        case 'CRITICAL':
            return 'dark';
        default:
            return 'light';
    }
};