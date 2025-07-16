import { Box, Typography, Stack, Avatar, Divider } from '@mui/material'

export default function JobListItem({
  job,
  isSelected,
  onClick,
  isLast = false,
}) {
  const { title, company, postedDate } = job

  return (
    <>
      <Box
        onClick={onClick}
        sx={{
          px: 2.5,
          py: 1.5,
          cursor: 'pointer',
          bgcolor: isSelected ? '#f0f7ff' : 'transparent',
          borderLeft: isSelected
            ? '4px solid #0a66c2'
            : '4px solid transparent',
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: isSelected ? '#f0f7ff' : '#fafafa',
          },
        }}
      >
        {/* Job Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Avatar
            sx={{
              bgcolor: '#0a66c2',
              width: 48,
              height: 48,
              fontSize: '1.2rem',
              fontWeight: 'bold',
            }}
          >
            {company?.charAt(0)?.toUpperCase() || 'C'}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant='h6'
              sx={{
                fontWeight: 600,
                fontSize: '1.1rem',
                color: '#0a66c2',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </Typography>

            <Typography
              variant='body1'
              sx={{
                fontWeight: 500,
                color: '#333',
              }}
            >
              {company}
            </Typography>

            {/* Footer Info */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <Typography variant='caption' color='text.secondary'>
                {postedDate || 'Recently posted'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {!isLast && <Divider />}
    </>
  )
}
