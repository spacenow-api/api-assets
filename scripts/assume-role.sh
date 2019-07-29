#!/bin/bash
unset  AWS_SESSION_TOKEN

temp_role=$(aws sts assume-role \
  --role-arn "arn:aws:iam::$ACCOUNT_ID:role/spacenow-role-api-cicd_role" \
  --role-session-name "spacenow-cli" \
  )

echo "export AWS_ACCESS_KEY_ID=$(echo $temp_role | jq .Credentials.AccessKeyId | xargs)" >> $BASH_ENV
echo "export AWS_SECRET_ACCESS_KEY=$(echo $temp_role | jq .Credentials.SecretAccessKey | xargs)" >> $BASH_ENV
echo "export AWS_SESSION_TOKEN=$(echo $temp_role | jq .Credentials.SessionToken | xargs)" >> $BASH_ENV

