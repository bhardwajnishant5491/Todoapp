/**
 * GLOBAL DASHBOARD DESIGN SYSTEM
 * 
 * Lock these values - DO NOT MODIFY without approval
 * All 3 dashboards share these base tokens but differ in intensity
 */

export const designTokens = {
  // ========== COLORS ==========
  colors: {
    // Global backgrounds
    bg: {
      app: '#F7F9F5',           // Main app background (all dashboards)
      card: '#FFFFFF',          // Card background (all dashboards)
      farmer: '#F0F7F4',        // Farmer-specific light green tint
      buyer: '#F9F7F5',         // Buyer-specific light gold tint
      admin: '#F5F6F8',         // Admin-specific light gray
    },
    
    // Role-specific primary colors
    primary: {
      farmer: '#4CAF50',        // Warm green
      buyer: '#4CAF50',         // Green for actions only
      admin: '#8B7BE3',         // Muted purple
    },
    
    // Role-specific accent colors
    accent: {
      farmer: '#F4A261',        // Soft gold (money only)
      buyer: '#D4A574',         // Light gold (prices)
      admin: '#6B5ED8',         // Lighter purple (minimal use)
    },
    
    // Semantic colors (shared)
    success: '#4CAF50',
    warning: '#F4A261',
    danger: '#EF4444',
    info: '#3B82F6',
    
    // Text colors
    text: {
      primary: '#1F2937',       // Dark gray
      secondary: '#6B7280',     // Medium gray
      muted: '#9CA3AF',         // Light gray
      white: '#FFFFFF',
    },
    
    // Border colors
    border: {
      light: '#E5E7EB',
      default: '#D1D5DB',
      dark: '#9CA3AF',
    },
  },
  
  // ========== BORDER RADIUS ==========
  radius: {
    farmer: '16px',             // Rounded (warm)
    buyer: '14px',              // Rounded (professional)
    admin: '10px',              // Squarer (serious)
    card: {
      farmer: '16px',
      buyer: '14px',
      admin: '10px',
    },
    button: {
      farmer: '12px',
      buyer: '10px',
      admin: '8px',
    },
    input: '10px',              // Same for all
    badge: '6px',               // Same for all
  },
  
  // ========== SPACING SCALE ==========
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  
  // ========== SHADOWS ==========
  shadows: {
    card: '0 2px 8px rgba(0, 0, 0, 0.04)',
    cardHover: '0 4px 16px rgba(0, 0, 0, 0.08)',
    button: '0 2px 4px rgba(0, 0, 0, 0.06)',
    dropdown: '0 4px 12px rgba(0, 0, 0, 0.12)',
  },
  
  // ========== TYPOGRAPHY ==========
  typography: {
    fontFamily: {
      heading: 'Poppins, sans-serif',
      body: 'Inter, sans-serif',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  // ========== LAYOUT ==========
  layout: {
    sidebar: {
      widthExpanded: '240px',
      widthCollapsed: '80px',
      farmer: {
        bg: '#FFFFFF',
        activeBg: '#F0F7F4',
        activeText: '#4CAF50',
      },
      buyer: {
        bg: '#FFFFFF',
        activeBg: '#F9F7F5',
        activeText: '#4CAF50',
      },
      admin: {
        bg: '#F5F6F8',
        activeBg: '#E8E6F3',
        activeText: '#8B7BE3',
      },
    },
    topBar: {
      height: '64px',
      bg: '#FFFFFF',
      borderBottom: '1px solid #E5E7EB',
    },
    header: {
      farmer: {
        height: '120px',
        gradient: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
      },
      buyer: {
        height: '100px',
        gradient: 'linear-gradient(135deg, #F9F7F5 0%, #FDF8F3 100%)',
      },
      admin: {
        height: '90px',
        gradient: 'linear-gradient(135deg, #F5F6F8 0%, #E8E6F3 100%)',
      },
    },
    card: {
      farmer: {
        padding: '24px',
        gap: '16px',
      },
      buyer: {
        padding: '20px',
        gap: '12px',
      },
      admin: {
        padding: '16px',
        gap: '12px',
      },
    },
  },
  
  // ========== TRANSITIONS ==========
  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },
  
  // ========== ICON SIZES ==========
  iconSizes: {
    xs: '16px',
    sm: '20px',
    md: '24px',
    lg: '32px',
    xl: '48px',
  },
};

/**
 * Helper function to get role-specific tokens
 */
export const getRoleTokens = (role) => {
  const roleMap = {
    farmer: 'farmer',
    buyer: 'buyer',
    admin: 'admin',
  };
  
  const normalizedRole = roleMap[role] || 'farmer';
  
  return {
    primaryColor: designTokens.colors.primary[normalizedRole],
    accentColor: designTokens.colors.accent[normalizedRole],
    bgColor: designTokens.colors.bg[normalizedRole],
    radius: designTokens.radius[normalizedRole],
    sidebar: designTokens.layout.sidebar[normalizedRole],
    header: designTokens.layout.header[normalizedRole],
    card: designTokens.layout.card[normalizedRole],
  };
};

export default designTokens;
