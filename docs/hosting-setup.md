# Hosting setup

Lowest effort option: host this on s3 somewhere, copying: https://github.com/lsst-epo/leaflet-test

If you have an AWS account existing:

- Make an S3 bucket (mine is `frozenfar`)
- Enable S3 static website hosting in
- Install AWS CLI
- Create a user with S3 permissions
- `aws s3 sync . s3://<your bucket name> --exclude '.git/*'`
