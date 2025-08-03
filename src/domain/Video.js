class Video {
  constructor({ video_id, title, location, file_name, generated_url, uploadedAt }) {
    this.video_id = video_id;
    this.title = title;
    this.location = location;
    this.file_name = file_name;
    this.generated_url = generated_url;
    this.uploadedAt = uploadedAt;
  }
}

module.exports = Video;