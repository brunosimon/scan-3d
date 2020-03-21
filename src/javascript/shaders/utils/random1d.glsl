float random(float n)
{
    return fract(sin(n) * 43758.5453);
}

#pragma glslify: export(random)
