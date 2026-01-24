#!/bin/bash

# HYDR801 AWS Deployment Script
# Usage: ./deploy-aws.sh [amplify|s3|ecs]

set -e

DEPLOYMENT_TYPE=${1:-amplify}
APP_NAME="hydr801-app"
REGION=${AWS_REGION:-us-east-1}

echo "🚀 HYDR801 AWS Deployment Script"
echo "================================="
echo "Deployment type: $DEPLOYMENT_TYPE"
echo "Region: $REGION"
echo ""

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Install it from: https://aws.amazon.com/cli/"
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Run: aws configure"
    exit 1
fi

echo "✅ AWS CLI configured"
echo ""

case $DEPLOYMENT_TYPE in
    amplify)
        echo "📦 Deploying to AWS Amplify..."
        echo ""
        echo "For Amplify, use the AWS Console:"
        echo "1. Go to: https://console.aws.amazon.com/amplify/"
        echo "2. Click 'New app' → 'Host web app'"
        echo "3. Connect your GitHub repository"
        echo "4. Amplify will auto-detect Next.js settings"
        echo "5. Click Deploy!"
        echo ""
        echo "Or use Amplify CLI:"
        echo "  npm install -g @aws-amplify/cli"
        echo "  amplify init"
        echo "  amplify push"
        ;;

    s3)
        echo "📦 Deploying to S3 + CloudFront..."
        
        # Build static export
        echo "Building static export..."
        
        # Check if next.config.js has static export
        if ! grep -q "output: 'export'" next.config.js; then
            echo "⚠️  Adding static export to next.config.js..."
            cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}
module.exports = nextConfig
EOF
        fi
        
        npm run build
        
        BUCKET_NAME="${APP_NAME}-${REGION}-$(aws sts get-caller-identity --query Account --output text)"
        
        # Create S3 bucket
        echo "Creating S3 bucket: $BUCKET_NAME"
        aws s3 mb "s3://$BUCKET_NAME" --region $REGION 2>/dev/null || true
        
        # Configure for static website
        aws s3 website "s3://$BUCKET_NAME" --index-document index.html --error-document index.html
        
        # Upload files
        echo "Uploading files..."
        aws s3 sync out/ "s3://$BUCKET_NAME" --delete
        
        # Set bucket policy
        aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy "{
            \"Version\": \"2012-10-17\",
            \"Statement\": [{
                \"Sid\": \"PublicRead\",
                \"Effect\": \"Allow\",
                \"Principal\": \"*\",
                \"Action\": \"s3:GetObject\",
                \"Resource\": \"arn:aws:s3:::$BUCKET_NAME/*\"
            }]
        }"
        
        echo ""
        echo "✅ Deployed to S3!"
        echo "URL: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
        echo ""
        echo "For HTTPS, create a CloudFront distribution pointing to this bucket."
        ;;

    ecs)
        echo "📦 Deploying to ECS Fargate..."
        
        ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
        ECR_REPO="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$APP_NAME"
        
        # Create ECR repository
        echo "Creating ECR repository..."
        aws ecr create-repository --repository-name $APP_NAME --region $REGION 2>/dev/null || true
        
        # Login to ECR
        echo "Logging into ECR..."
        aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"
        
        # Build Docker image
        echo "Building Docker image..."
        docker build -t $APP_NAME .
        
        # Tag and push
        echo "Pushing to ECR..."
        docker tag $APP_NAME:latest $ECR_REPO:latest
        docker push $ECR_REPO:latest
        
        # Deploy CloudFormation stack
        echo "Deploying CloudFormation stack..."
        aws cloudformation deploy \
            --template-file aws/cloudformation-stack.yaml \
            --stack-name hydr801-$REGION \
            --parameter-overrides \
                EnvironmentName=production \
                ContainerImage=$ECR_REPO:latest \
            --capabilities CAPABILITY_IAM \
            --region $REGION
        
        # Get outputs
        ALB_URL=$(aws cloudformation describe-stacks \
            --stack-name hydr801-$REGION \
            --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerURL`].OutputValue' \
            --output text)
        
        echo ""
        echo "✅ Deployed to ECS Fargate!"
        echo "URL: $ALB_URL"
        ;;

    *)
        echo "Usage: ./deploy-aws.sh [amplify|s3|ecs]"
        echo ""
        echo "Options:"
        echo "  amplify  - Deploy to AWS Amplify (recommended)"
        echo "  s3       - Deploy static export to S3 + CloudFront"
        echo "  ecs      - Deploy to ECS Fargate (containers)"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment complete!"
