package com.example.peakyblinders;

import android.content.Context;
import android.service.autofill.TextValueSanitizer;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import org.w3c.dom.Text;

public class MyAdapter extends RecyclerView.Adapter<MyAdapter.MyViewHolder> {

    String names[];
    int images[];
    Context context;

    public MyAdapter(Context ct, String s1[], int imgs[]){
        context = ct;
        names = s1;
        images = imgs;
    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View view = inflater.inflate(R.layout.my_row, parent, false);
        return new MyViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MyViewHolder holder, int position) {
        holder.name_txt.setText(names[position]);
        holder.image_icon.setImageResource(images[position]);
    }

    @Override
    public int getItemCount() {
        return images.length;
    }

    public class MyViewHolder extends RecyclerView.ViewHolder {

        TextView name_txt;
        ImageView image_icon;

        public MyViewHolder(@NonNull View itemView) {
            super(itemView);
            name_txt = itemView.findViewById(R.id.name_txt);
            image_icon = itemView.findViewById(R.id.image_icon);
        }
    }
}
