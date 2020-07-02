import { useTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';

export default function useIsMobile() {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.down('sm'));
}
