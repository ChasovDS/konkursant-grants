// src/utils/permissions.js

export const ROLE_PERMISSIONS = {
    admin: {
        canViewAdminPage: true, // Администратор может видеть страницу администратора
        canViewModeratorPage: true, // Администратор может видеть страницу модератора
        canViewUserPage: true, // Администратор может видеть страницу пользователя
        canEditUsers: true, // Администратор может редактировать пользователей
        canDeleteUsers: true, // Администратор может удалять пользователей
        canManageRoles: true, // Администратор может управлять ролями пользователей
        canViewReports: true, // Администратор может видеть отчеты
    },
    moderator: {
        canViewAdminPage: false, // Модератор не может видеть страницу администратора
        canViewModeratorPage: true, // Модератор может видеть страницу модератора
        canViewUserPage: true, // Модератор может видеть страницу пользователя
        canEditPosts: true, // Модератор может редактировать посты
        canDeletePosts: true, // Модератор может удалять посты
        canManageComments: true, // Модератор может управлять комментариями
    },
    event_manager: {
        canViewAdminPage: false, // Менеджер событий не может видеть страницу администратора
        canViewModeratorPage: false, // Менеджер событий не может видеть страницу модератора
        canViewUserPage: true, // Менеджер событий может видеть страницу пользователя
        canCreateEvents: true, // Менеджер событий может создавать события
        canEditEvents: true, // Менеджер событий может редактировать события
        canDeleteEvents: true, // Менеджер событий может удалять события
        // Добавьте другие разрешения для менеджеров событий
    },
    expert: {
        canViewAdminPage: false, // Эксперт не может видеть страницу администратора
        canViewModeratorPage: false, // Эксперт не может видеть страницу модератора
        canViewUserPage: true, // Эксперт может видеть страницу пользователя
        canSubmitReports: true, // Эксперт может отправлять отчеты
        // Добавьте другие разрешения для экспертов
    },
    user: {
        canViewAdminPage: false, // Обычный пользователь не может видеть страницу администратора
        canViewModeratorPage: false, // Обычный пользователь не может видеть страницу модератора
        canViewUserPage: true, // Обычный пользователь может видеть свою страницу
        canCreatePosts: true, // Обычный пользователь может создавать посты
        canComment: true, // Обычный пользователь может комментировать посты
        // Добавьте другие разрешения для обычных пользователей
    },
};
