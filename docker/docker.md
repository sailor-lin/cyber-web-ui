# 使用docker发布版本

1. npm run build
2. 切到docker目录下
3. docker build -t 113.108.106.175:444/cmp/cmp-admin-web:1.0.0 .
4. docker push 113.108.106.175:444/cmp/cmp-admin-web:1.0.0

注：最后的数字是版本号，提交相同版本号会覆盖之前提交的版本

5. 