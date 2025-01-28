const setting = {
  environment: 'prod', //this will be dev,demo,prod
  // 'https://front-dev-bloom.fullestop.io/mobile-cms/'

  dev: {
    api_url: "https://z6h1cmgcr8.execute-api.ap-south-1.amazonaws.com",
    api_image_post_url: "https://z6h1cmgcr8.execute-api.ap-south-1.amazonaws.com",
    cms_url: "https://front-dev-bloom.fullestop.io/",
    domain: "www.bloomsflora.com",
  },
  demo: {
    api_url: "https://apis.dev.bloomsflora.com",
    api_image_post_url: "https://ld8npo3pij.execute-api.ap-south-1.amazonaws.com",
    cms_url: "https://www.dev.bloomsflora.com/",
    domain: "www.bloomsflora.com",
  },
  prod: {
    api_url: "https://api.bloomsflora.com",
    api_image_post_url: "https://api.bloomsflora.com",
    cms_url: "https://www.bloomsflora.com/",
    domain: "www.bloomsflora.com",
  },
  reactionVideoShow: 1,
  reactionVideoUrl: "https://cdn.bloomsflora.com/bloomsflora/reaction.mp4",
  header_key: "Authorization",
  header_value: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbW9uZXlkcm9wLmRldjMuZ2lwbC5pbmV0L2FwaS9pbmRleCIsImlhdCI6MTY3MzM0NzgxOCwiZXhwIjoxNjczMzUxNDE4LCJuYmYiOjE2NzMzNDc4MTgsImp0aSI6ImVLVUVwNUxLb1FudWlnSVYiLCJzdWIiOiI4NCIsInBydiI6IjRhNmUyNTJkNDljYzM1ZjlhNmQyODk3ZmRlNGY5MzE0NmU3YzgwMmMifQ.TKFoBslN4fvUbyOXyYzgf0BoorExyvmt5QeRjcUx2_8",
}
export default setting;